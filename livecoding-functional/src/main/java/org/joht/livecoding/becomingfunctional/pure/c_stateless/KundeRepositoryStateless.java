package org.joht.livecoding.becomingfunctional.pure.c_stateless;

import java.util.function.Function;

import org.joht.livecoding.becomingfunctional.pure.model.KontoEntity;
import org.joht.livecoding.becomingfunctional.pure.model.KontoRepository;
import org.joht.livecoding.becomingfunctional.pure.model.KundeEntity;
import org.joht.livecoding.becomingfunctional.pure.model.KundeRepository;
import org.joht.livecoding.becomingfunctional.pure.model.Kundennummer;

/**
 * Die Funktion {@link #loescheKunde(KundeEntity, Function)} erfuellt das Kriterium "output only
 * depends on input" vollstaendig, da sie sowohl "state-less" ist, als auch ausschliesslich
 * Eingabeparameter nutzt.
 * <li>Die Funktion ist NICHT "side-effect-free", da sie KontoEntity-Objekte aendert.
 * 
 * @author johannestroppacher
 */
public class KundeRepositoryStateless implements KundeRepository {

	private final KontoRepository kontoRepository;

	// "@Inject" (ueber Dependency Injection anbindbare Abhaengigkeit)
	public KundeRepositoryStateless(KontoRepository kontoRepository) {
		this.kontoRepository = kontoRepository;
	}

	/**
	 * {@inheritDoc}
	 * <p>
	 * Diese Methode dient als Fassade, um die Anbindung der Funktion zu demonstrieren.
	 */
	@Override
	public void loescheKunde(KundeEntity kunde) {
		loescheKunde(kunde, kontoRepository::getKundenKonten);
	}

	void loescheKunde(KundeEntity kunde, Function<Kundennummer, Iterable<KontoEntity>> kontenLeser) {
		if (kunde.isGeloescht()) { // "state-less" Loesung um doppelte Loeschung zu verhindern.
			return;
		}
		kunde.loeschen();
		Iterable<KontoEntity> konten = kontenLeser.apply(kunde.getKundennummer());
		for (KontoEntity konto : konten) {
			if (!konto.isExtern()) {
				konto.loeschen(); // "side-effect"
			}
		}
	}

	@Override
	public String toString() {
		return "KundeRepositoryStateless [kontoRepository=" + kontoRepository + "]";
	}
}