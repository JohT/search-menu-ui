package org.joht.livecoding.becomingfunctional.firstclass;

import java.util.ArrayList;
import java.util.Collection;

import org.joht.livecoding.becomingfunctional.firstclass.api.Kunde;
import org.joht.livecoding.becomingfunctional.firstclass.api.KundenService;

public class A_Kunden_KopierterCode implements KundenService {

	private final Collection<Kunde> kunden = new ArrayList<>();

	public A_Kunden_KopierterCode(Collection<? extends Kunde> kunden) {
		this.kunden.addAll(kunden);
	}

	@Override
	public Collection<String> getVornamenAktiverKunden() {
		Collection<String> ergebnis = new ArrayList<>();
		for (Kunde kunde : kunden) {
			if (kunde.isAktiv()) {
				ergebnis.add(kunde.getVorname());
			}
		}
		return ergebnis;
	}

	@Override
	public Collection<String> getNachnamenAktiverKunden() {
		Collection<String> ergebnis = new ArrayList<>();
		for (Kunde kunde : kunden) {
			if (kunde.isAktiv()) {
				ergebnis.add(kunde.getNachname());
			}
		}
		return ergebnis;
	}

	@Override
	public Collection<String> getVornamenInaktiverKunden() {
		Collection<String> ergebnis = new ArrayList<>();
		for (Kunde kunde : kunden) {
			if (!kunde.isAktiv()) {
				ergebnis.add(kunde.getVorname());
			}
		}
		return ergebnis;
	}

	@Override
	public Collection<String> getNachnamenInaktiverKunden() {
		Collection<String> ergebnis = new ArrayList<>();
		for (Kunde kunde : kunden) {
			if (!kunde.isAktiv()) {
				ergebnis.add(kunde.getNachname());
			}
		}
		return ergebnis;
	}

	@Override
	public String toString() {
		return "A_Kunden_KopierterCode [kunden=" + kunden + "]";
	}
}