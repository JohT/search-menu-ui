package org.joht.livecoding.eventdriven.address;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotSame;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class AddressTest {

	private static final String ID = "1";
	private static final String NAME = "John Doe";
	private static final String STREET = "Mainstreet 1";
	private static final String COUNTRY = "Hampshire";
	
	private Address addressUnderTest;
	
	@BeforeEach
	private void setUp() {
		addressUnderTest = new Address(ID, NAME, STREET, COUNTRY);
	}
	
	@Test
	void containsId() {
		assertEquals(ID, addressUnderTest.getId());
	}
	
	@Test
	void containsName() {
		assertEquals(NAME, addressUnderTest.getName());
	}
	
	@Test
	void containsStreet() {
		assertEquals(STREET, addressUnderTest.getStreet());
	}
	
	@Test
	void containsCountry() {
		assertEquals(COUNTRY, addressUnderTest.getCountry());
	}
	
	@DisplayName("should create a new adress with the new street")
	@Test
	void moveToNewStreet() {
		String expectedStreet = "NewStreet 10";
		Address newAddress = addressUnderTest.movedToStreet(expectedStreet);
		
		assertEquals(expectedStreet, newAddress.getStreet());
		assertEquals(addressUnderTest.getId(), newAddress.getId());
		assertEquals(addressUnderTest.getName(), newAddress.getName());
		assertEquals(addressUnderTest.getCountry(), newAddress.getCountry());
		assertNotSame(addressUnderTest, newAddress);
	}
}