package org.joht.livecoding.becomingfunctional.firstclass.api;

public class Kunde {

	private static final boolean AKTIV = true;
	private static final boolean INAKTIV = false;

	private final String vorname;
	private final String nachname;
	private final boolean aktiv;

	/**
	 * Erzeugt aus dem Vor- und Nachnamen einen aktiven {@link Kunde}n.
	 * 
	 * @param zusammengesetzterName {@link String}
	 * @return {@link Kunde}
	 */
	public static final Kunde aktivMitNamen(String vorname, String nachname) {
		return new Kunde(vorname, nachname, AKTIV);
	}

	/**
	 * Erzeugt aus dem Vor- und Nachnamen einen inaktiven {@link Kunde}n.
	 * 
	 * @param zusammengesetzterName {@link String}
	 * @return {@link Kunde}
	 */
	public static final Kunde inaktivMitNamen(String vorname, String nachname) {
		return new Kunde(vorname, nachname, INAKTIV);
	}

	protected Kunde(String vorname, String nachname, boolean aktiv) {
		this.vorname = vorname.trim();
		this.nachname = nachname.trim();
		this.aktiv = aktiv;
	}

	public String getVorname() {
		return vorname;
	}

	public String getNachname() {
		return nachname;
	}

	public boolean isAktiv() {
		return aktiv;
	}

	public boolean isInaktiv() {
		return !isAktiv();
	}

	@Override
	public String toString() {
		return "Kunde [vorname=" + vorname + ", nachname=" + nachname + ", aktiv=" + aktiv + "]";
	}
}