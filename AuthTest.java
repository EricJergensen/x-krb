import java.security.Principal;
import java.security.PrivilegedExceptionAction;
import javax.security.auth.Subject;
import javax.security.auth.login.LoginContext;
import org.ietf.jgss.GSSContext;
import org.ietf.jgss.GSSCredential;
import org.ietf.jgss.GSSManager;
import org.ietf.jgss.Oid;

public class AuthTest {
	public static void main(String[] argv) throws Exception {
		if (argv.length != 1) {
			System.out.println("Usage: java {-Dstuff} AuthTest context-name");
			System.out.println(" -Djava.security.auth.login.config=");
			System.out.println(" -Djava.security.krb5.conf=");
			System.exit(1);
		}
        LoginContext lc = null;
        GSSContext gssContext = null;
        byte[] outToken = null;
        Principal principal = null;
		lc = new LoginContext(argv[0]);
		lc.login();
		Subject subject = lc.getSubject();
		System.out.println("Subject: " + subject);

		// Assume the GSSContext is stateless
		// TODO: Confirm this assumption
		final GSSManager manager = GSSManager.getInstance();
		final int credentialLifetime = GSSCredential.DEFAULT_LIFETIME;
		final PrivilegedExceptionAction<GSSCredential> action =
			new PrivilegedExceptionAction<GSSCredential>() {
				@Override
				public GSSCredential run() throws Exception {
					return manager.createCredential(null,
													credentialLifetime,
													new Oid("1.3.6.1.5.5.2"),
													GSSCredential.ACCEPT_ONLY);
				}
			};
		gssContext = manager.createContext(Subject.doAs(subject, action));
		System.out.println("gssContext: " + gssContext);
		gssContext.dispose();
		lc.logout();
	}
}
