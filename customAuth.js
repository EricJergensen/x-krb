var AccountUserDO = Java.type("edge.server.account.principal.AccountUserDO");
var domain = "default";

function getPrincipal(request) {
  if ("SPNEGO".equals(request.getAuthType())) {
    logger.info(request.getAuthType());
    var userName = request.getRemoteUser();
    logger.info(userName);
    var princ = request.getUserPrincipal();
    for (var i = 0; i < princ.getRoles().length; ++i) logger.info(princ.getRoles()[i]);
    var user = accountService.getUserByUsername(userName + '@' + domain);
    logger.info(user);
    if (user == null) {
      logger.info('creating user: ' + userName + '@' + domain);
      var resolver = getAccountResolver(userName, domain);
      logger.info('got resolver: ' + resolver);
      var pair = resolver.getAdapterByUser(userName, domain);
      logger.info('got pair: ' + pair);
      user = pair.getKey().addUser(new AccountUserDO(userName,null,{},"embedded",null,null), domain);
      logger.info('added user: ' + user);
      logger.info('added user/un: ' + user.getUserName());
      logger.info('added user/dn: ' + user.getDomainName());
      pair.getKey().addUserToGroup(user, pair.getValue());
      logger.info('user added to group');
    }
    logger.info(user);
    return user;
  }
  return null;
}

function getAccountResolver(userName, domainName) {
  for each (var r in accountService.getAccountResolvers()) {
    if (r.getAdapterByUser(userName, domainName) != null) return r;
  }
  return null;
}
