package org.joht.livecoding.becomingfunctional.firstclass;

import org.joht.livecoding.becomingfunctional.firstclass.api.KundenService;

public class A_Kunden_KopierterCodeTest extends AbstractKundenServiceTest {

	@Override
	protected KundenService getKundenService() {
		return new A_Kunden_KopierterCode(getTestkunden());
	}
}