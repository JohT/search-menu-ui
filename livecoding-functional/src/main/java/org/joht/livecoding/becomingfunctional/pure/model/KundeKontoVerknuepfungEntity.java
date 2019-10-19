package org.joht.livecoding.becomingfunctional.pure.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

public class KundeKontoVerknuepfungEntity {

	private final Kundennummer kundennummer; // Entity ID

	private final List<KontoEntity> konten = new ArrayList<>();

	public static final KundeKontoVerknuepfungEntity empty(Kundennummer kundennummer) {
		return new KundeKontoVerknuepfungEntity(kundennummer);
	}

	public KundeKontoVerknuepfungEntity(Kundennummer kundennummer) {
		this.kundennummer = kundennummer;
	}

	public Kundennummer getKundennummer() {
		return kundennummer;
	}

	public List<KontoEntity> getKonten() {
		return konten;
	}

	public KundeKontoVerknuepfungEntity verknuepfeKonto(KontoEntity konto) {
		this.konten.add(konto);
		return this;
	}

	public KundeKontoVerknuepfungEntity verknuepfeKonten(Collection<KontoEntity> konten) {
		this.konten.addAll(konten);
		return this;
	}

	@Override
	public boolean equals(final Object other) {
		if ((other == null) || (!getClass().equals(other.getClass()))) {
			return false;
		}
		return Objects.equals(kundennummer, ((KundeKontoVerknuepfungEntity) other).kundennummer);
	}

	@Override
	public int hashCode() {
		return Objects.hash(kundennummer);
	}

	@Override
	public String toString() {
		return "KundeKontoVerknuepfungEntity [kundennummer=" + kundennummer + ", konten=" + konten + "]";
	}
}
