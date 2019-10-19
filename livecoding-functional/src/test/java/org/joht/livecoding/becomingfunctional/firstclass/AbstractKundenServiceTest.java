package org.joht.livecoding.becomingfunctional.firstclass;

import static org.joht.livecoding.becomingfunctional.firstclass.KundeTestdaten.JOHN_DOE;
import static org.joht.livecoding.becomingfunctional.firstclass.KundeTestdaten.RICHARD_MILES;
import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.joht.livecoding.becomingfunctional.firstclass.api.Kunde;
import org.joht.livecoding.becomingfunctional.firstclass.api.KundenService;
import org.junit.Ignore;
import org.junit.Test;

/**
 * In diesem speziellen Fall, bei dem meherere Implementierungen eines Interfaces mit den exakt
 * gleichen Testfaellen getestet werden sollen, eignet sich eine abstrakte Super-Klasse am besten.
 * Grundsaetzlich gilt aber: Composition over inheritance.
 * 
 * @author johannestroppacher
 */
@Ignore
public abstract class AbstractKundenServiceTest {

	protected abstract KundenService getKundenService();

	@Test
	public void vornamenAktiverKundenVollstaendig() {
		Collection<String> namen = getKundenService().getVornamenAktiverKunden();
		assertEquals(listOf("John"), listOf(namen));
	}

	@Test
	public void vornamenInaktiverKundenVollstaendig() {
		Collection<String> namen = getKundenService().getVornamenInaktiverKunden();
		assertEquals(listOf("Richard"), listOf(namen));
	}

	@Test
	public void nachnamenAktiverKundenVollstaendig() {
		Collection<String> namen = getKundenService().getNachnamenAktiverKunden();
		assertEquals(listOf("Doe"), listOf(namen));
	}

	@Test
	public void nachnamenInaktiverKundenVollstaendig() {
		Collection<String> namen = getKundenService().getNachnamenInaktiverKunden();
		assertEquals(listOf("Miles"), listOf(namen));
	}

	protected Collection<Kunde> getTestkunden() {
		return KundeTestdaten.of(JOHN_DOE, RICHARD_MILES);
	}

	/**
	 * Erzeugt eine fuer Vergleiche geeignete {@link ArrayList} aus den angegebenen Elementen.
	 * 
	 * @param elements {@link String}s.
	 * @return {@link List} of {@link String}s.
	 */
	private static List<String> listOf(String... elements) {
		return listOf(Arrays.asList(elements));
	}

	/**
	 * Erzeugt eine fuer Vergleiche geeignete {@link ArrayList} aus der angegebenen {@link Collection}.
	 * 
	 * @param elements {@link Collection} of {@link String}s.
	 * @return {@link List} of {@link String}s.
	 */
	private static List<String> listOf(Collection<String> elements) {
		return new ArrayList<>(elements);
	}
}