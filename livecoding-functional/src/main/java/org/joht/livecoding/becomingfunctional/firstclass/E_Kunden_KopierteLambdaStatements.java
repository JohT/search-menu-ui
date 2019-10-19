package org.joht.livecoding.becomingfunctional.firstclass;

import java.util.ArrayList;
import java.util.Collection;
import java.util.stream.Collectors;

import org.joht.livecoding.becomingfunctional.firstclass.api.Kunde;
import org.joht.livecoding.becomingfunctional.firstclass.api.KundenService;

/**
 * Auch wenn diese Implementierung durch die Lambda Schreibweise um einiges lesbarbarer und
 * verstaendlicher wird, gibt es hier wieder das Problem mit dem kopierten Code. <br>
 * Da es sich jeweils nur um eine Zeile handelt, erscheint das auf den ersten Blick nebensaechlich.
 * Tatsaechlich muessen Erweiterungen, wie beispielsweise das Herausfiltern von Musterkunden, an
 * allen Stellen eingebaut werden. Die Erweiterbarkeit/Skalierbarkeit ist also beeintraechtigt.
 * 
 * @author johannestroppacher
 */
public class E_Kunden_KopierteLambdaStatements implements KundenService {

	private final Collection<Kunde> kunden = new ArrayList<>();

	public E_Kunden_KopierteLambdaStatements(Collection<? extends Kunde> kunden) {
		this.kunden.addAll(kunden);
	}

	@Override
	public Collection<String> getVornamenAktiverKunden() {
		return kunden.stream().filter(Kunde::isAktiv).map(Kunde::getVorname).collect(Collectors.toList());
	}

	@Override
	public Collection<String> getNachnamenAktiverKunden() {
		return kunden.stream().filter(Kunde::isAktiv).map(Kunde::getNachname).collect(Collectors.toList());
	}

	@Override
	public Collection<String> getVornamenInaktiverKunden() {
		return kunden.stream().filter(Kunde::isInaktiv).map(Kunde::getVorname).collect(Collectors.toList());
	}

	@Override
	public Collection<String> getNachnamenInaktiverKunden() {
		return kunden.stream().filter(Kunde::isInaktiv).map(Kunde::getNachname).collect(Collectors.toList());
	}

	@Override
	public String toString() {
		return "E_Kunden_KopierteLambdaStatements [kunden=" + kunden + "]";
	}
}