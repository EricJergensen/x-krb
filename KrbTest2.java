import org.apache.http.impl.client.DefaultHttpClient;
import com.jivesoftware.authHelper.utils.*;
import com.jivesoftware.authHelper.consts.*;

public class KrbTest2 {
  public static void main(String[] argv) throws Exception {
    DefaultHttpClient httpclient = new DefaultHttpClient();
    AuthUtils.securityLogging(SecurityLogType.KERBEROS,true);
    //SSLUtils.trustJDKDefaultSSLCertificates();
    //AuthUtils.useBrowserUserAgent();
    CredentialsUtils.setKerberosCredentials(client, new UsernamePasswordCredentials("eric", "my-linux-password"), "EDGETI.COM", "kdc");
    HttpGet httpget = new HttpGet("http://katana/krb");
    client.executeMethod(httpget);
    System.out.println(response.getStatusLine());
  }
}
