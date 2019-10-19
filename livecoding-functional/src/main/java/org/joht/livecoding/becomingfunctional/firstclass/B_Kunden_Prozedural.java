package org.joht.livecoding.becomingfunctional.firstclass;

import java.util.ArrayList;
import java.util.Collection;

import org.joht.livecoding.becomingfunctional.firstclass.api.Kunde;
import org.joht.livecoding.becomingfunctional.firstclass.api.KundenService;

public class B_Kunden_Prozedural implements KundenService {

	private final Collection<Kunde> kunden = new ArrayList<>();

	public B_Kunden_Prozedural(Collection<? extends Kunde> kunden) {
		this.kunden.addAll(kunden);
	}

	// Der prozedurale Loesungsweg fuehrt zu einer hohen nicht-fachlich-bedingten Komplexitaet.
	// Hier Komplexitaet als Anzahl der verschachtelten Verzeigungen ("Branches").
	//@formatter:off
	private Collection<String> getKunden(String funktionskennzeichen) {
		Collection<String> ergebnis = new ArrayList<>();
		for (Kunde kunde : kunden) {
			if ((funktionskennzeichen.contains("A") &&  kunde.isAktiv()) //
			||  (funktionskennzeichen.contains("I") && !kunde.isAktiv())) {
				if (funktionskennzeichen.contains("V")) {
					ergebnis.add(kunde.getVorname());
				} else if (funktionskennzeichen.contains("N")) {
					ergebnis.add(kunde.getNachname());
				}
			}
		}
		return ergebnis;
	}
	//@formatter:on

	@Override
	public Collection<String> getNachnamenInaktiverKunden() {
		return getKunden("NI");
	}

	@Override
	public Collection<String> getVornamenInaktiverKunden() {
		return getKunden("VI");
	}

	@Override
	public Collection<String> getNachnamenAktiverKunden() {
		return getKunden("NA");
	}

	@Override
	public Collection<String> getVornamenAktiverKunden() {
		return getKunden("VA");
	}

	@Override
	public String toString() {
		return "B_Kunden_Prozedural [kunden=" + kunden + "]";
	}
}