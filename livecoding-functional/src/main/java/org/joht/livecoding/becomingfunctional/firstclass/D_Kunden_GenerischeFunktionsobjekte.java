package org.joht.livecoding.becomingfunctional.firstclass;

import java.util.ArrayList;
import java.util.Collection;
import java.util.function.Function;
import java.util.function.Predicate;

import org.joht.livecoding.becomingfunctional.firstclass.api.Kunde;
import org.joht.livecoding.becomingfunctional.firstclass.api.KundenService;

public class D_Kunden_GenerischeFunktionsobjekte implements KundenService {

	private final Collection<Kunde> kunden = new ArrayList<>();

	public D_Kunden_GenerischeFunktionsobjekte(Collection<? extends Kunde> kunden) {
		this.kunden.addAll(kunden);
	}

	private Collection<String> getKundenfelder(Function<Kunde, String> converter, Predicate<Kunde> filter) {
		Collection<String> ergebnis = new ArrayList<>();
		for (Kunde kunde : kunden) {
			if (filter.test(kunde)) {
				ergebnis.add(converter.apply(kunde));
			}
		}
		return ergebnis;
	}

	@Override
	public Collection<String> getVornamenAktiverKunden() {
		// Variante 1: Lambda Funktione
		return getKundenfelder(kunde -> kunde.getVorname(), kunde -> kunde.isAktiv());
	}

	@Override
	public Collection<String> getNachnamenAktiverKunden() {
		return getKundenfelder(kunde -> kunde.getNachname(), kunde -> kunde.isAktiv());
	}

	@Override
	public Collection<String> getVornamenInaktiverKunden() {
		// Variante 2: Lambda method reference mit ::
		return getKundenfelder(Kunde::getVorname, Kunde::isInaktiv);
	}

	@Override
	public Collection<String> getNachnamenInaktiverKunden() {
		// Variante 3: Interne, an einer Stelle implementierte Lambda method reference.
		return getKundenfelder(this::getNachname, this::isInaktiv);
	}

	private String getNachname(Kunde kunde) {
		return kunde.getNachname();
	}

	private boolean isAktiv(Kunde kunde) {
		return kunde.isAktiv();
	}

	private boolean isInaktiv(Kunde kunde) {
		return !isAktiv(kunde);
	}

	@Override
	public String toString() {
		return "D_Kunden_GenerischeFunktionsobjekte [kunden=" + kunden + "]";
	}
}