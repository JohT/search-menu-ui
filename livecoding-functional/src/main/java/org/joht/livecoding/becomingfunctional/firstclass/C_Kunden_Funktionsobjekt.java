package org.joht.livecoding.becomingfunctional.firstclass;

import java.util.ArrayList;
import java.util.Collection;

import org.joht.livecoding.becomingfunctional.firstclass.api.Kunde;
import org.joht.livecoding.becomingfunctional.firstclass.api.KundenService;
import org.joht.livecoding.becomingfunctional.firstclass.converter.KundenTextFeldMapper;
import org.joht.livecoding.becomingfunctional.firstclass.converter.KundenTextFeldMapperNachname;
import org.joht.livecoding.becomingfunctional.firstclass.converter.KundenTextFeldMappers;

public class C_Kunden_Funktionsobjekt implements KundenService {

	private final Collection<Kunde> kunden = new ArrayList<>();

	public C_Kunden_Funktionsobjekt(Collection<? extends Kunde> kunden) {
		this.kunden.addAll(kunden);
	}

	private Collection<String> getFeldAktiverKunden(KundenTextFeldMapper converter) {
		Collection<String> ergebnis = new ArrayList<>();
		for (Kunde kunde : kunden) {
			if (kunde.isAktiv()) {
				ergebnis.add(converter.getTextFeld(kunde));
			}
		}
		return ergebnis;
	}

	private Collection<String> getFeldInaktiverKunden(KundenTextFeldMapper converter) {
		Collection<String> ergebnis = new ArrayList<>();
		for (Kunde kunde : kunden) {
			if (!kunde.isAktiv()) {
				ergebnis.add(converter.getTextFeld(kunde));
			}
		}
		return ergebnis;
	}

	@Override
	public Collection<String> getVornamenAktiverKunden() {
		// Variante 1 (klassisch): Interface mittels anonymer Klasse vor Ort implementieren
		return getFeldAktiverKunden(new KundenTextFeldMapper() {

			@Override
			public String getTextFeld(Kunde kunde) {
				return kunde.getVorname();
			}
		});
	}

	@Override
	public Collection<String> getNachnamenAktiverKunden() {
		// Variante 2 (klassisch): Eigene Klasse je Funktionsauspraegung.
		return getFeldAktiverKunden(new KundenTextFeldMapperNachname());
	}

	@Override
	public Collection<String> getVornamenInaktiverKunden() {
		// Variante 3 (seit Java 1.5): Enum mit mehreren Interface-Implementierungen
		return getFeldInaktiverKunden(KundenTextFeldMappers.VORNAME);
	}

	@Override
	public Collection<String> getNachnamenInaktiverKunden() {
		// Variante 4 (seit Java 1.8): Lambda method reference
		return getFeldInaktiverKunden(Kunde::getNachname);
	}

	@Override
	public String toString() {
		return "C_Kunden_Funktionsobjekt [kunden=" + kunden + "]";
	}
}