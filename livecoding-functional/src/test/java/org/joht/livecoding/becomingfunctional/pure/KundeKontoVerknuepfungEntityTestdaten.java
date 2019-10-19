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
enum KundeKontoVerknuepfungEntityTestdaten {

	ALLE_KONTEN {
		@Override
		public KundeKontoVerknuepfungEntity buildFor(Kundennummer kundennummer) {
			KundeKontoVerknuepfungEntity verknuepfung = new KundeKontoVerknuepfungEntity(kundennummer);
			verknuepfung.verknuepfeKonten(KontoEntityTestdaten.alle());
			return verknuepfung;
		}
	},
	LOESCHBARE_KONTEN {
		@Override
		public KundeKontoVerknuepfungEntity buildFor(Kundennummer kundennummer) {
			KundeKontoVerknuepfungEntity verknuepfung = new KundeKontoVerknuepfungEntity(kundennummer);
			verknuepfung.verknuepfeKonto(KontoEntityTestdaten.AKTIVES_KONTO_1.build());
			return verknuepfung;
		}
	},
	EXTERNE_KONTEN {
		@Override
		public KundeKontoVerknuepfungEntity buildFor(Kundennummer kundennummer) {
			KundeKontoVerknuepfungEntity verknuepfung = new KundeKontoVerknuepfungEntity(kundennummer);
			verknuepfung.verknuepfeKonto(KontoEntityTestdaten.AKTIVES_EXTERNES_KONTO_2.build());
			verknuepfung.verknuepfeKonto(KontoEntityTestdaten.GELOESCHTES_EXTERNES_KONTO_4.build());
			return verknuepfung;
		}
	},
	NICHT_LOESCHBARE_KONTEN {
		@Override
		public KundeKontoVerknuepfungEntity buildFor(Kundennummer kundennummer) {
			KundeKontoVerknuepfungEntity verknuepfung = new KundeKontoVerknuepfungEntity(kundennummer);
			verknuepfung.verknuepfeKonto(KontoEntityTestdaten.AKTIVES_EXTERNES_KONTO_2.build());
			verknuepfung.verknuepfeKonto(KontoEntityTestdaten.GELOESCHTES_KONTO_3.build());
			verknuepfung.verknuepfeKonto(KontoEntityTestdaten.GELOESCHTES_EXTERNES_KONTO_4.build());
			return verknuepfung;
		}
	},

	;
	public abstract KundeKontoVerknuepfungEntity buildFor(Kundennummer kundennummer);
}