package org.joht.livecoding.becomingfunctional.pure;

import java.util.Collections;
import java.util.List;

import org.joht.livecoding.becomingfunctional.pure.model.KontoEntity;
import org.joht.livecoding.becomingfunctional.pure.model.KontoRepository;
import org.joht.livecoding.becomingfunctional.pure.model.KundeKontoVerknuepfungEntity;
import org.joht.livecoding.becomingfunctional.pure.model.Kundennummer;
import org.junit.Ignore;

@Ignore
public class KontoTestRespository implements KontoRepository {

	private final KundeKontoVerknuepfungEntity verknuepfung;

	public KontoTestRespository(KundeKontoVerknuepfungEntity verknuepfung) {
		this.verknuepfung = verknuepfung;
	}

	@Override
	public List<KontoEntity> getKundenKonten(Kundennummer kundennummer) {
		return verknuepfung.getKundennummer().equals(kundennummer) ? verknuepfung.getKonten() : Collections.emptyList();
	}

	@Override
	public String toString() {
		return "KontoTestRespository [verknuepfung=" + verknuepfung + "]";
	}
}
