package org.joht.livecoding.eventdriven.eventnotification;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AddressChangedEventTest {
	
	private static final String ID = "1";
	
	private AddressChangedEvent eventUnderTest;
	
	@BeforeEach
	private void setUp() {
		eventUnderTest = new AddressChangedEvent(ID);
	}
	
	@Test
	public void containsId() {
		assertEquals(ID, eventUnderTest.getId());
	}

}