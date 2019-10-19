package org.joht.livecoding.becomingfunctional.pure.model;

import java.util.List;

public interface KontoRepository {

	/**
	 * Liefert die zum angegebenen Kunden vernuepften Konten.
	 * 
	 * @param kundennummer {@link Kundennummer}
	 * @return {@link List}e mit Elemente vom Typ {@link KontoEntity}.
	 */
	List<KontoEntity> getKundenKonten(Kundennummer kundennummer);
}
