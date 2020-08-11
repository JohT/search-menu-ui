package org.joht.livecoding.eventdriven.eventstatetransfer;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.joht.livecoding.eventdriven.address.Address;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AddressStateChangedEventTest {
	
	private static final Address ADDRESS_OLD = new Address("1", "John Doe", "Mainstreet 1", "Hampshire");
	private static final Address ADDRESS_NEW = new Address("1", "John Doe", "Secondstreet 2", "Yorkshire");
	
	private AddressStateChangedEvent eventUnderTest;
	
	@BeforeEach
	private void setUp() {
		eventUnderTest = new AddressStateChangedEvent(ADDRESS_OLD, ADDRESS_NEW);
	}
	
	@Test
	public void containsOldAddress() {
		assertEquals(ADDRESS_OLD, eventUnderTest.getOldAdress());
	}
	
	@Test
	public void containsNewAddress() {
		assertEquals(ADDRESS_NEW, eventUnderTest.getNewAdress());
	}

}