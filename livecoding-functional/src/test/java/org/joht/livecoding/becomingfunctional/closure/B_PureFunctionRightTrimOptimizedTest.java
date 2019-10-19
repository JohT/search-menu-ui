package org.joht.livecoding.becomingfunctional.closure;

import static org.junit.Assert.*;

import java.util.Collection;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

@RunWith(Parameterized.class)
public class B_PureFunctionRightTrimOptimizedTest {

	private final RightTrimTestCase testCase;

	@Parameters(name = "{0} ({index})")
    public static Collection<Object[]> data() {
        return RightTrimTestCase.all();
    }
	
	public B_PureFunctionRightTrimOptimizedTest(RightTrimTestCase testCase) {
		this.testCase = testCase;
	}

	@Test
	public void testCaseShouldBeFulfilled() {
		B_PureFunctionRightTrimOptimized functionUnderTest = new B_PureFunctionRightTrimOptimized();	
		String result = functionUnderTest.apply(testCase.getInput());
		assertEquals(testCase.getExpectedResult(), result);
	}

}
