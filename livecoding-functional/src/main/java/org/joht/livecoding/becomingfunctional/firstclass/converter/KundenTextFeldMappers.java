package org.joht.livecoding.becomingfunctional.firstclass.converter;

import org.joht.livecoding.becomingfunctional.firstclass.api.Kunde;

/**
 * Beispiel fuer die Implementierung mehrerer {@link KundenTextFeldMapper} als enum.
 * 
 * @author johannestroppacher
 */
public enum KundenTextFeldMappers implements KundenTextFeldMapper {

	VORNAME {
		@Override
		public String getTextFeld(Kunde kunde) {
			return kunde.getVorname();
		}
	},
	NACHNAME {
		@Override
		public String getTextFeld(Kunde kunde) {
			return kunde.getNachname();
		}
	}
}
