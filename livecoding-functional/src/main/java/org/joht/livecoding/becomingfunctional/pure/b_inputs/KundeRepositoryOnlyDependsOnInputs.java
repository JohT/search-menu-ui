package org.joht.livecoding.becomingfunctional.pure.b_inputs;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import org.joht.livecoding.becomingfunctional.pure.model.KontoEntity;
import org.joht.livecoding.becomingfunctional.pure.model.KontoRepository;
import org.joht.livecoding.becomingfunctional.pure.model.KundeEntity;
import org.joht.livecoding.becomingfunctional.pure.model.KundeRepository;
import org.joht.livecoding.becomingfunctional.pure.model.Kundennummer;

/**
 * Die Funktion {@link #loescheKunde(KundeEntity, Function)} erfuellt nur teilweise das Kriterium
 * "output only depends on input".
 * <li>Die Funktion ist NICHT "state-less". Das Verhalten beim Folgeaufruf ist anders.
 * <li>Die Funktion ist NICHT "side-effect-free", da sie KontoEntity-Objekte aendert.
 * 
 * @author johannestroppacher
 */
public class KundeRepositoryOnlyDependsOnInputs implements KundeRepository {

	private final List<Long> bereitsGeloeschteKunden = new ArrayList<>(); // "state"

	private final KontoRepository kontoRepository;

	// "@Inject" (ueber Dependency Injection anbindbare Abhaengigkeit)
	public KundeRepositoryOnlyDependsOnInputs(KontoRepository kontoRepository) {
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
		Long kundennummer = kunde.getKundennummer().asLong();
		if (bereitsGeloeschteKunden.contains(kundennummer)) {
			return;
		}
		kunde.loeschen();
		Iterable<KontoEntity> konten = kontenLeser.apply(kunde.getKundennummer());
		for (KontoEntity konto : konten) {
			if (!konto.isExtern()) {
				konto.loeschen(); // "side-effect"
			}
		}
		bereitsGeloeschteKunden.add(kundennummer);
	}

	@Override
	public String toString() {
		return "KundeRepositoryOnlyDependsOnInputs [bereitsGeloeschteKunden=" + bereitsGeloeschteKunden
				+ ", kontoRepository=" + kontoRepository + "]";
	}
}