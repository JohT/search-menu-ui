package org.joht.livecoding.eventdriven.address;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import org.joht.livecoding.eventdriven.eventnotification.AddressChangedEvent;

@ApplicationScoped
public class AddressTestService {

	private static final Address ADDRESS_JOHN_DOE = new Address("1", "John Doe", "Mainstreet 1", "Hampshire");
	private Map<String, Address> addresses = new HashMap<>();
	
	@Inject
	private Event<AddressChangedEvent> event;
	
	@PostConstruct
	void init() {
		setAddress(ADDRESS_JOHN_DOE);
	}
	
	public Address getAddress(String id) {
		return addresses.get(id);
	}
	
	public void setAddress(Address address) {
		String id = address.getId();
		if (addresses.put(id, address) != null) {
			event.fire(new AddressChangedEvent(id));
		}
	}
}