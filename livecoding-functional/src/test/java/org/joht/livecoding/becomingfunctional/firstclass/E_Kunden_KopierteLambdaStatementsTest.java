package org.joht.livecoding.becomingfunctional.firstclass;

import org.joht.livecoding.becomingfunctional.firstclass.api.KundenService;

public class E_Kunden_KopierteLambdaStatementsTest extends AbstractKundenServiceTest {

	@Override
	protected KundenService getKundenService() {
		return new E_Kunden_KopierteLambdaStatements(getTestkunden());
	}
}
