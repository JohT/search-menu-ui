package org.joht.livecoding.becomingfunctional.pure.model;

import java.util.Objects;

public class KundeEntity implements Loeschbar {

	private final Kundennummer kundennummer; // Entity ID
	private boolean geloescht = false;
	private long anzahlAenderungen = 0;

	public KundeEntity(Kundennummer kundennummer) {
		this.kundennummer = kundennummer;
	}

	public Kundennummer getKundennummer() {
		return kundennummer;
	}

	@Override
	public boolean isGeloescht() {
		return geloescht;
	}

	@Override
	public void loeschen() {
		this.geloescht = true;
		this.anzahlAenderungen++;
	}

	/**
	 * Nur zu Testzwecken.
	 * 
	 * @return
	 */
	public long getAnzahlAenderungen() {
		return anzahlAenderungen;
	}

	@Override
	public boolean equals(final Object other) {
		if ((other == null) || (!getClass().equals(other.getClass()))) {
			return false;
		}
		return Objects.equals(kundennummer, ((KundeEntity) other).kundennummer);
	}

	@Override
	public int hashCode() {
		return Objects.hash(kundennummer);
	}

	@Override
	public String toString() {
		return "KundeEntity [kundennummer=" + kundennummer + ", geloescht=" + geloescht + ", anzahlAenderungen="
				+ anzahlAenderungen + "]";
	}
}