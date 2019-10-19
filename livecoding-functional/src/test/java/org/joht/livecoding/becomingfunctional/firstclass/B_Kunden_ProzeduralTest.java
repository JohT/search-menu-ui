package org.joht.livecoding.becomingfunctional.firstclass;

import org.joht.livecoding.becomingfunctional.firstclass.api.KundenService;

public class B_Kunden_ProzeduralTest extends AbstractKundenServiceTest {

	@Override
	protected KundenService getKundenService() {
		return new B_Kunden_Prozedural(getTestkunden());
	}
}
