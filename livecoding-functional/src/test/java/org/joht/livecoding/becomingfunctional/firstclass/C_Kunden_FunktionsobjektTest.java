package org.joht.livecoding.becomingfunctional.firstclass;

import org.joht.livecoding.becomingfunctional.firstclass.api.KundenService;

public class C_Kunden_FunktionsobjektTest extends AbstractKundenServiceTest {

	@Override
	protected KundenService getKundenService() {
		return new C_Kunden_Funktionsobjekt(getTestkunden());
	}
}
