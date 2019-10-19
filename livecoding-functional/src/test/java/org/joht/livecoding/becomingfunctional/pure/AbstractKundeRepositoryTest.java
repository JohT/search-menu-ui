package org.joht.livecoding.becomingfunctional.pure;

import static org.joht.livecoding.becomingfunctional.pure.KundeKontoVerknuepfungEntityTestdaten.ALLE_KONTEN;
import static org.joht.livecoding.becomingfunctional.pure.KundeKontoVerknuepfungEntityTestdaten.EXTERNE_KONTEN;
import static org.joht.livecoding.becomingfunctional.pure.KundeKontoVerknuepfungEntityTestdaten.LOESCHBARE_KONTEN;
import static org.junit.Assert.assertEquals;

import org.joht.livecoding.becomingfunctional.pure.model.KontoEntity;
import org.joht.livecoding.becomingfunctional.pure.model.KundeEntity;
import org.joht.livecoding.becomingfunctional.pure.model.KundeKontoVerknuepfungEntity;
import org.joht.livecoding.becomingfunctional.pure.model.KundeRepository;
import org.joht.livecoding.becomingfunctional.pure.model.Kundennummer;
import org.junit.Ignore;
import org.junit.Test;

/**
 * In diesem speziellen Fall, bei dem meherere Implementierungen eines Interfaces mit den exakt
 * gleichen Testfaellen getestet werden sollen, eignet sich eine abstrakte Super-Klasse am besten.
 * Grundsaetzlich gilt aber: Composition over inheritance.
 * 
 * @author johannestroppacher
 */
@Ignore
public abstract class AbstractKundeRepositoryTest {

	protected abstract Kundennummer getKundennummer();

	protected abstract KundeRepository getKundeRepository(KundeKontoVerknuepfungEntity verknuepfung);

	@Test
	public void loeschbareKontenGeloescht() {
		KundeEntity kunde = KundeEntityTestdaten.AKTIVER_KUNDE.buildFor(getKundennummer());
		KundeKontoVerknuepfungEntity verknuepfung = erzeugeVerknuepfung(LOESCHBARE_KONTEN);
		long erwarteteAnzahl = anzahlKontenAus(verknuepfung);

		getKundeRepository(verknuepfung).loescheKunde(kunde);

		assertEquals(erwarteteAnzahl, anzahlGeloeschterKontenAus(verknuepfung));
	}

	@Test
	public void externeKontenWerdenNichtGeloescht() {
		KundeEntity kunde = KundeEntityTestdaten.AKTIVER_KUNDE.buildFor(getKundennummer());
		KundeKontoVerknuepfungEntity verknuepfung = erzeugeVerknuepfung(EXTERNE_KONTEN);
		long erwarteteAnzahl = anzahlGeloeschterKontenAus(verknuepfung);

		getKundeRepository(verknuepfung).loescheKunde(kunde);

		assertEquals(erwarteteAnzahl, anzahlGeloeschterKontenAus(verknuepfung));
	}

	@Test
	public void loeschungWirdNurEinmalDurchgefuehrt() {
		KundeEntity kunde = KundeEntityTestdaten.AKTIVER_KUNDE.buildFor(getKundennummer());
		KundeKontoVerknuepfungEntity verknuepfung = erzeugeVerknuepfung(ALLE_KONTEN);
		assertEquals(0, kunde.getAnzahlAenderungen());

		KundeRepository kundeRepository = getKundeRepository(verknuepfung);
		kundeRepository.loescheKunde(kunde);
		assertEquals(1, kunde.getAnzahlAenderungen());

		kundeRepository.loescheKunde(kunde);
		assertEquals(1, kunde.getAnzahlAenderungen());
	}

	private long anzahlKontenAus(KundeKontoVerknuepfungEntity verknuepfung) {
		return verknuepfung.getKonten().stream().count();
	}

	private long anzahlGeloeschterKontenAus(KundeKontoVerknuepfungEntity verknuepfung) {
		return verknuepfung.getKonten().stream().filter(KontoEntity::isGeloescht).count();
	}

	private KundeKontoVerknuepfungEntity erzeugeVerknuepfung(KundeKontoVerknuepfungEntityTestdaten testdaten) {
		return testdaten.buildFor(getKundennummer());
	}
}