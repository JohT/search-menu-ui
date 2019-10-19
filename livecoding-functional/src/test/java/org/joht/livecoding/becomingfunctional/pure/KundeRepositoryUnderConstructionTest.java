package org.joht.livecoding.becomingfunctional.pure;

import org.joht.livecoding.becomingfunctional.pure.model.KontoDatenbankRepository;
import org.joht.livecoding.becomingfunctional.pure.model.KundeKontoVerknuepfungEntity;
import org.joht.livecoding.becomingfunctional.pure.model.KundeRepository;
import org.joht.livecoding.becomingfunctional.pure.model.Kundennummer;

public class KundeRepositoryUnderConstructionTest extends AbstractKundeRepositoryTest {

	private static final Kundennummer KUNDENNUMMER = Kundennummer.of(123_456_789_01L);

	@Override
	protected KundeRepository getKundeRepository(KundeKontoVerknuepfungEntity verknuepfung) {
		KontoTestRespository repository = new KontoTestRespository(verknuepfung);
		KundeRepository repositoryToTest = new KundeRepositoryUnderConstruction();
		KontoDatenbankRepository.setTestRepository(repository);
		return repositoryToTest;
	}

	@Override
	protected Kundennummer getKundennummer() {
		return KUNDENNUMMER;
	}
}
