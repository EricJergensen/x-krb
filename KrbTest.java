import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class KrbTest {
  public static void main(String[] argv) throws Exception {
    CredentialsProvider credsProvider = new BasicCredentialsProvider();
    credsProvider.setCredentials(
				 new AuthScope("katana", 80),
				 new UsernamePasswordCredentials("eric", "linux-password"));
    CloseableHttpClient httpclient = HttpClients.custom()
      .setDefaultCredentialsProvider(credsProvider)
      .build();
    try {
      HttpGet httpget = new HttpGet("http://katana/krb");

      System.out.println("Executing request " + httpget.getRequestLine());
      CloseableHttpResponse response = httpclient.execute(httpget);
      try {
	System.out.println("----------------------------------------");
	System.out.println(response.getStatusLine());
	EntityUtils.consume(response.getEntity());
      } finally {
	response.close();
      }
    } finally {
      httpclient.close();
    }
  }
}
