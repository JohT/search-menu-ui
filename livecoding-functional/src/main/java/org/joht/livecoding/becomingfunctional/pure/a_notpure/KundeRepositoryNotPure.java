package org.joht.livecoding.becomingfunctional.pure.a_notpure;

import java.util.ArrayList;
import java.util.List;

import org.joht.livecoding.becomingfunctional.pure.model.KontoDatenbankRepository;
import org.joht.livecoding.becomingfunctional.pure.model.KontoEntity;
import org.joht.livecoding.becomingfunctional.pure.model.KundeEntity;
import org.joht.livecoding.becomingfunctional.pure.model.KundeRepository;

/**
 * Die Funktion {@link #loescheKunde(KundeEntity)} erfuellt keine der Kriterien fuer "pure
 * functions":
 * <li>Das Verhalten der Funktion ist nich einzig von den Eingabeparametern abhaengig.
 * <li>Die Funktion ist NICHT "state-less". Das Verhalten beim Folgeaufruf ist anders.
 * <li>Die Funktion ist NICHT "side-effect-free", da sie KontoEntity-Objekte aendert.
 * 
 * @author johannestroppacher
 */
public class KundeRepositoryNotPure implements KundeRepository {

	private final List<Long> bereitsGeloeschteKunden = new ArrayList<>(); // "state"

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void loescheKunde(KundeEntity kunde) {
		Long kundennummer = kunde.getKundennummer().asLong();
		if (bereitsGeloeschteKunden.contains(kundennummer)) {
			return;
		}
		kunde.loeschen();
		// Externer Eingabeparameter (Liste von Konten) ausserhalb der Methoden-Eingabeparametern
		// "external/back-door dependency"
		List<KontoEntity> konten = new KontoDatenbankRepository().getKundenKonten(kunde.getKundennummer());
		for (KontoEntity konto : konten) {
			if (!konto.isExtern()) {
				konto.loeschen(); // "side-effect"
			}
		}
		bereitsGeloeschteKunden.add(kundennummer);
	}

	@Override
	public String toString() {
		return "KundeRepositoryNotPure [bereitsGeloeschteKunden=" + bereitsGeloeschteKunden + "]";
	}
}