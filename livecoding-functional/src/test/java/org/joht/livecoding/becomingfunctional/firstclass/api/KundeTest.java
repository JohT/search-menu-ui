package org.joht.livecoding.becomingfunctional.firstclass.api;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public class KundeTest {

	private Kunde zuTestenderKunde;

	@Test
	public void enthaeltVornamen() {
		String vorname = "John";
		zuTestenderKunde = new Kunde(vorname, "", true);
		assertEquals(vorname, zuTestenderKunde.getVorname());
	}

	@Test
	public void enthaeltNachnamen() {
		String nachname = "Doe";
		zuTestenderKunde = new Kunde("", nachname, true);
		assertEquals(nachname, zuTestenderKunde.getNachname());
	}

	@Test
	public void aktiverKunde() {
		zuTestenderKunde = Kunde.aktivMitNamen("John", "Doe");
		assertTrue(zuTestenderKunde.isAktiv());
		assertFalse(zuTestenderKunde.isInaktiv());
	}

	@Test
	public void inaktiverKunde() {
		zuTestenderKunde = Kunde.inaktivMitNamen("John", "Doe");
		assertFalse(zuTestenderKunde.isAktiv());
		assertTrue(zuTestenderKunde.isInaktiv());
	}

}
