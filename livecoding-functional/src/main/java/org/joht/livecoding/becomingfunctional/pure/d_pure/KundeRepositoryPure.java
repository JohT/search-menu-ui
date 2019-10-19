package org.joht.livecoding.becomingfunctional.pure.d_pure;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.function.Function;

import org.joht.livecoding.becomingfunctional.pure.model.KontoEntity;
import org.joht.livecoding.becomingfunctional.pure.model.KontoRepository;
import org.joht.livecoding.becomingfunctional.pure.model.KundeEntity;
import org.joht.livecoding.becomingfunctional.pure.model.KundeRepository;
import org.joht.livecoding.becomingfunctional.pure.model.Kundennummer;
import org.joht.livecoding.becomingfunctional.pure.model.Loeschbar;

/**
 * Die Funktion {@link #zuLoeschendeElemente(KundeEntity, Function)} erfuellt das Kriterium "output
 * only depends on input" vollstaendig, da sie sowohl "state-less" ist, als auch ausschliesslich die
 * Eingabeparameter nutzt.
 * 
 * @author johannestroppacher
 */
public class KundeRepositoryPure implements KundeRepository {

	private final KontoRepository kontoRepository;

	// "@Inject" (ueber Dependency Injection anbindbare Abhaengigkeit)
	public KundeRepositoryPure(KontoRepository kontoRepository) {
		this.kontoRepository = kontoRepository;
	}

	/**
	 * {@inheritDoc}
	 * <p>
	 * Diese Methode dient als Fassade, um die Anbindung der Funktion zu demonstrieren.
	 */
	@Override
	public void loescheKunde(KundeEntity kunde) {
		zuLoeschendeElemente(kunde, kontoRepository::getKundenKonten).forEach(Loeschbar::loeschen);
	}

	List<Loeschbar> zuLoeschendeElemente(KundeEntity kunde, Function<Kundennummer, Iterable<KontoEntity>> kontenLeser) {
		if (kunde.isGeloescht()) {
			return Collections.emptyList();
		}
		List<Loeschbar> zuLoeschendeElemente = new ArrayList<>();
		zuLoeschendeElemente.add(kunde);
		for (KontoEntity konto : kontenLeser.apply(kunde.getKundennummer())) {
			if (!konto.isExtern()) {
				zuLoeschendeElemente.add(konto);
			}
		}
		return zuLoeschendeElemente;
	}

	@Override
	public String toString() {
		return "KundeRepositoryPure [kontoRepository=" + kontoRepository + "]";
	}
}