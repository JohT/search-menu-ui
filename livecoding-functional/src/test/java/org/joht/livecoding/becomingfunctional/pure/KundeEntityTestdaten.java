package org.joht.livecoding.becomingfunctional.pure;

import org.joht.livecoding.becomingfunctional.pure.model.KundeEntity;
import org.joht.livecoding.becomingfunctional.pure.model.KundeKontoVerknuepfungEntity;
import org.joht.livecoding.becomingfunctional.pure.model.Kundennummer;
import org.junit.Ignore;

/**
 * Object-Mother zum Erzeugen von Test-Objekte vom Typ {@link KundeEntity} und
 * {@link KundeKontoVerknuepfungEntity}.
 * 
 * @author johannestroppacher
 */
@Ignore
enum KundeEntityTestdaten {

	AKTIVER_KUNDE {
		@Override
		public KundeEntity buildFor(Kundennummer kundennummer) {
			return new KundeEntity(kundennummer);
		}
	},
	GELOESCHTER_KUNDE_2 {
		@Override
		public KundeEntity buildFor(Kundennummer kundennummer) {
			KundeEntity kundeEntity = new KundeEntity(kundennummer);
			kundeEntity.loeschen();
			return kundeEntity;
		}
	},

	;
	public abstract KundeEntity buildFor(Kundennummer kundennummer);
}