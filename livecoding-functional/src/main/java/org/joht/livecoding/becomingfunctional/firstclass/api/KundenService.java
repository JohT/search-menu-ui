package org.joht.livecoding.becomingfunctional.firstclass.api;

import java.util.Collection;

public interface KundenService {

	Collection<String> getVornamenAktiverKunden();

	Collection<String> getNachnamenAktiverKunden();

	Collection<String> getVornamenInaktiverKunden();

	Collection<String> getNachnamenInaktiverKunden();
}
