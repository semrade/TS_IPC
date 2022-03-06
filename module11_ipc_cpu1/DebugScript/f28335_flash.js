//Import DebugServer enving and Java packages
importPackage(Packages.com.ti.debug.engine.scripting);
importPackage(Packages.com.ti.ccstudio.scripting.environment);
importPackage(Packages.java.lang);

var Program1 	= "ipc_gpio_toggle_cpu01.out";
var Executable 	= "C:\\Users\\STarikUser\\workspace_v10\\ipc_gpio_toggle_cpu01\\CPU1_FLASH_STANDALONE\\" + Program1;

//Global handles to the debugger
var env 	= ScriptingEnvironment.instance();

// Create a log file in the current directory to log script execution
env.traceBegin("BreakpointsTestLog.xml", "DefaultStylesheet.xsl");

// Set our TimeOut
env.setScriptTimeout(15000);

// Log everything
env.traceSetConsoleLevel(TraceLevel.ALL);
env.traceSetFileLevel(TraceLevel.ALL);

//
var server 	= env.getServer("DebugServer.1");
server.setConfig("TMS320F28379D.ccxml");

//Texas Instruments XDS100v2 USB Debug Probe_0/C28xx_CPU1
//Texas Instruments XDS100v2 USB Debug Probe_0/CPU1_CLA1
//Texas Instruments XDS100v2 USB Debug Probe_0/C28xx_CPU2
//Texas Instruments XDS100v2 USB Debug Probe_0/CPU2_CLA1
//Texas Instruments XDS100v2 USB Debug Probe_0/IcePick_C_0
env.traceWrite("open session for each CORE and each CLA.");
try
{
	
	var CPU1Session 	= server.openSession("Texas Instruments XDS100v2 USB Debug Probe_0/C28xx_CPU1");
	var CPU1CLA1Session = server.openSession("Texas Instruments XDS100v2 USB Debug Probe_0/CPU1_CLA1");
	var CPU2Session 	= server.openSession("Texas Instruments XDS100v2 USB Debug Probe_0/C28xx_CPU2");
	var CPU2CLA2Session = server.openSession("Texas Instruments XDS100v2 USB Debug Probe_0/CPU2_CLA1");
	env.traceWrite("Done!");
}
catch(err)
{
	env.traceWrite("Error in set configuration.");
}


// Create a log file in the current directory to log script execution
env.traceBegin("FlashLog.xml", "DefaultStylesheet.xsl");

/* Connect to target
*/
env.traceWrite("*** Connecting to CPU1, CPU2, CPU1_CLA1, CPU2_CLA2****");

CPU1Session.target.connect();
CPU1CLA1Session.target.connect();
CPU2Session.target.connect();
CPU2CLA2Session.target.connect();

env.traceWrite("CPU1, CPU1_CLA1, CPU2, CPU2_CLA2 are Connected!");

/* Set flash properties
*/
/* Clock settings */
//CPU1Session.flash.options.setString("FlashOSCCLK","30");
//CPU1Session.flash.options.setString("FlashCLKINDV","2");
//CPU1Session.flash.options.setString("FlashPLLCR","10");

/* sectors to erase */
env.traceWrite("sectors to erase");
try{

	env.traceWrite("***********Look up for the exact option usign the printOptions API***********");
	env.traceWrite("***********Look up for the exact option usign the printOptions API***********");
	env.traceWrite("***********Look up for the exact option usign the printOptions API***********");
	env.traceWrite("***********Look up for the exact option usign the printOptions API***********");
	CPU1Session.flash.options.printOptions(".*");
	env.traceWrite("****************************************Done*********************************");
	env.traceWrite("****************************************Done*********************************");
	env.traceWrite("****************************************Done*********************************");
	env.traceWrite("****************************************Done*********************************");
	//CPU1Session.flash.options.setBoolean("FlashC28Bank0Sector0", true);
	//CPU1Session.flash.options.setBoolean("FLASHB", true);
	//CPU1Session.flash.options.setBoolean("FLASHC", true);
	//CPU1Session.flash.options.setBoolean("FLASHD", true);
	//CPU1Session.flash.options.setBoolean("FLASHE", true);
	//CPU1Session.flash.options.setBoolean("FLASHF", true);
	//CPU1Session.flash.options.setBoolean("FLASHG", true);
	//CPU1Session.flash.options.setBoolean("FLASHH", true);
	//CPU1Session.flash.options.setBoolean("FLASHI", true);
	//CPU1Session.flash.options.setBoolean("FLASHJ", true);
	//CPU1Session.flash.options.setBoolean("FLASHK", true);
	//CPU1Session.flash.options.setBoolean("FLASHL", true);
	//CPU1Session.flash.options.setBoolean("FLASHM", true);
	//CPU1Session.flash.options.setBoolean("FLASHN", true);
	CPU1Session.flash.erase();
	CPU2Session.flash.erase();
	env.traceWrite("Done!");

}
catch(err)
{
	env.traceWrite("Error in Flash Programmer.");
}


/* frequency test settings */
/* for 281x devices */
//CPU1Session.flash.options.setString("FTRegister", "GPAMux");
//CPU1Session.flash.options.setString("FTPin","GPIOx0");
/* for other devices */
//CPU1Session.flash.options.setString("FTPin","GPIO0 (A)");

/* flash operations */
//CPU1Session.flash.startFrequencyTest();
//CPU1Session.flash.endFrequencyTest();
//CPU1Session.flash.erase();
//CPU1Session.flash.programPassword();
//CPU1Session.flash.lock();
//CPU1Session.flash.unlock();
//CPU1Session.flash.calculateChecksum();
//CPU1Session.flash.depletionRecovery();

/* load program setting */
//CPU1Session.flash.options.setString("FlashOperations","Erase, Program, Verify");

try
{
	//Load the Program
	env.traceWrite("Load Program: "+Program1);
	env.traceWrite("Loading...");

	// Load the same program to cpu1 and cpu 2
	CPU1Session.memory.loadProgram(Executable );
	env.traceWrite("CPU1 done.");

	CPU2Session.memory.loadProgram(Executable );
	env.traceWrite("CPU2 done.");

	// Get Flash Checksum
	env.traceWrite("Cheksum calculation for cpu1 and cpu2 ");
	CPU1Session.flash.calculateChecksum();
	CPU2Session.flash.calculateChecksum();
}
catch(err)
{
	env.traceWrite("Error in Flash Programmer.");
}

// Run the program for the first and second TCI6488 CPU simultaneously
env.traceWrite("Executing program on first and second TMS320F28379D CPUs ...");

var dsArray = new Array();
dsArray[0] = CPU1Session;
dsArray[1] = CPU2Session;

// Set a breakpoint at "main_cpu1"
env.traceWrite("Set a breakpoint at main_cpu1");
var maincpu1 = CPU1Session.symbol.getAddress("main");
var cpu1bp1 = CPU1Session.breakpoint.add(maincpu1);
env.traceWrite("Done!");

// Set a breakpoint at "main_cpu2"
env.traceWrite("Set a breakpoint at main_cpu2");
var maincpu2 = CPU2Session.symbol.getAddress("main");
var cpu2bp1 = CPU2Session.breakpoint.add(maincpu2);
env.traceWrite("Done!");

// Restart our Target
env.traceWrite("Restart our Target");
CPU1Session.target.restart();
CPU2Session.target.restart();

// Run our one by one
env.traceWrite("Run our Target one by one ");
CPU1Session.target.run();
script.traceWrite("CPU 1 Runinng ...");
CPU2Session.target.run();
script.traceWrite("CPU 2 Runinng ...");

// Run our Target simultaneous
env.traceWrite("Run our Target simultaneous");
server.simultaneous.run(dsArray); // Run CPUs 1 and 2
script.traceWrite("Runinng ...");

//End CPU1Session, since the tests are done
server.stop();

//Terminate CPU1
CPU1Session.terminate();
CPU1CLA1Session.terminate();

//Terminate CPU1
CPU2Session.terminate();
CPU2CLA2Session.terminate();
