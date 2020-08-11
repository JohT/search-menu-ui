package org.joht.livecoding.eventdriven.eventstatetransfer;

import static org.junit.jupiter.api.Assertions.assertEquals;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.jboss.weld.junit5.auto.EnableAutoWeld;
import org.joht.livecoding.eventdriven.address.Address;
import org.joht.livecoding.eventdriven.address.AddressService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@EnableAutoWeld
class AddressEventStateTransferTest {

	private static final String ADDRESS_ID = "1";

	@Inject
	private AddressService addressService;

	private Address newAddressOfInsuranceService = null;

	@Test
	@DisplayName("insurance should be recalculated based on the subsequently changed address")
	public void addressChangeNotificated() {
		Address address = addressService.getAddress(ADDRESS_ID);
		String newStreet = "NewStreet 10b";
		addressService.setAddress(address.movedToStreet(newStreet));
		assertEquals(newStreet, newAddressOfInsuranceService.getStreet());
	}

	/**
	 * Represents a "downstream" service, that should recalculates an insurance
	 * when an address has changed.
	 * 
	 * @param event {@link AddressStateChangedEvent}
	 */
	public void recalculateInsurance(@Observes AddressStateChangedEvent event) {
		// since the event now contains all informations about the new
		// (and old) state (all address fields) of the address,
		// the "downstream" service gets all informations and does
		// not need to query the address.
		newAddressOfInsuranceService = event.getNewAdress();

	}
}