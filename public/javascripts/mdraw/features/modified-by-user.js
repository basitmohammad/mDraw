/**
 * To show the user who modified a shape in mdraw.
 */

define(["mdraw", "mdraw.comm"],
       function(mdraw, commType) {
           
           function showModifiedByUser() {

               // while sending draw event include user name
               commType.prototype.sendDrawMsg = 
                   (function (originalDrawMsg) {
                        return function (data) {
                            data.modifiedBy = mdraw.userName;
                            originalDrawMsg.call(mdraw.comm, data);
                        };
                    })(commType.prototype.sendDrawMsg);

               // on receiving draw event show user name
               commType.prototype.onDraw = 
                   (function (originalOnDraw) {
                        return function(data) {
                            originalOnDraw.call(mdraw.comm, data);

                            if(data.modifiedBy) {
                                var shape = data.args[0].object
                                    || data.args[0];
                                animate(userDiv(data.modifiedBy, 
                                                shape.left, 
                                                shape.top));
                            }
                        };
                    })(commType.prototype.onDraw);

               function userDiv (user, x, y) {
                   return '<div class="modified-user"' 
                       + ' style="left: '+ x + 'px;' 
                       + ' top: '+ y + 'px;">' 
                       + user 
                       + '</div>';
               }

               function animate (div) {
                   $(div)
                       .appendTo('#canvasId')
                       .animate({"top":"-=20", "opacity":"-=10" }, 
                                1000, 
                                "swing",
                                function () { $(this).remove(); });
               }

           }

           return {
               init: showModifiedByUser
           };
       });
