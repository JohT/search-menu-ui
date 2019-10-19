package org.joht.livecoding.becomingfunctional.firstclass.converter;

import org.joht.livecoding.becomingfunctional.firstclass.api.Kunde;

/**
 * Beispiel fuer die klassische Implementierung eines Mappers fuer den Vornamen.
 */
public class KundenTextFeldMapperVorname implements KundenTextFeldMapper {

	@Override
	public String getTextFeld(Kunde kunde) {
		return kunde.getVorname();
	}

}