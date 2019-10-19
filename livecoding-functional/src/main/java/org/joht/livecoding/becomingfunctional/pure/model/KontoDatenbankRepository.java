package org.joht.livecoding.becomingfunctional.pure.model;

import java.util.Collections;
import java.util.List;

public class KontoDatenbankRepository implements KontoRepository {

	// Stellvertretend fuer die Datenbank
	private static KontoRepository testrepository = null;

	/**
	 * {@inheritDoc}
	 */
	@Override
	public List<KontoEntity> getKundenKonten(Kundennummer kundennummer) {
		return (testrepository != null) ? testrepository.getKundenKonten(kundennummer) : Collections.emptyList();
	}

	/**
	 * Nur fuer Testzwecke und wenn {@link KontoDatenbankRepository} nicht unmittlebar austauschbar
	 * ist.<br>
	 * Diese Methode muss nur dann verwendet werden, wenn im Design austauschbare Abhaengigkeiten nicht
	 * beruecksichtigt wurden.
	 * <p>
	 * Ermoeglicht es, einzelne {@link KundeKontoVerknuepfungEntity} zu Testzwecken zu hinterlegen.
	 * 
	 * @param repository {@link KontoRepository}
	 * @deprecated {@link KontoRepository} sollte austauschbar sein.
	 */
	@Deprecated
	public static void setTestRepository(KontoRepository repository) {
		KontoDatenbankRepository.testrepository = repository;
	}
}
