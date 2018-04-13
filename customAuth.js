var AccountUserDO = Java.type("edge.server.account.principal.AccountUserDO");
var domain = "default";

function getPrincipal(request) {
  if ("SPNEGO".equals(request.getAuthType())) {
    var userName = request.getRemoteUser();
    logger.info(userName);
    var princ = request.getUserPrincipal();
    for (var i = 0; i < princ.getRoles().length; ++i) logger.info(princ.getRoles()[i]);
    var user = accountService.getUserByUsername(userName + '@' + domain);
    logger.info(user);
    if (user == null) {
      logger.info('creating user: ' + userName + '@' + domain);
      var pair = accountResolver.getAdapterByUser(userName, domain);
      user = pair.getKey().addUser(new AccountUserDO(userName,null,{},"embedded",null,null), domain);
      pair.getKey().addUserToGroup(user, pair.getValue());
    }
    logger.info(user);
    return user;
  }
  return null;
}
