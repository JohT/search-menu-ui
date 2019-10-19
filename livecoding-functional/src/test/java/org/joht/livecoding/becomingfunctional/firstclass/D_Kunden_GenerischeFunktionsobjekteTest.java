package org.joht.livecoding.becomingfunctional.firstclass;

import org.joht.livecoding.becomingfunctional.firstclass.api.KundenService;

public class D_Kunden_GenerischeFunktionsobjekteTest extends AbstractKundenServiceTest {

	@Override
	protected KundenService getKundenService() {
		return new D_Kunden_GenerischeFunktionsobjekte(getTestkunden());
	}
}
