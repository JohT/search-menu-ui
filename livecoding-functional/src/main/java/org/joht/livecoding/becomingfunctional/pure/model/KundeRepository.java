package org.joht.livecoding.becomingfunctional.pure.model;

@FunctionalInterface
public interface KundeRepository {

	/**
	 * Markiert den angegebenen Kunden und all seine bei uns gefuehrten Geschaefte als geloescht.
	 * 
	 * @param kunde {@link KundeEntity}
	 */
	void loescheKunde(KundeEntity kunde);
}
