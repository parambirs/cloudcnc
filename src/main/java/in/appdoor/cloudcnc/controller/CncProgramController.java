package in.appdoor.cloudcnc.controller;

import in.appdoor.cloudcnc.model.CncProgram;
import in.appdoor.cloudcnc.service.CncProgramService;

import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.appengine.api.datastore.Text;

@Controller
public class CncProgramController {
	
	private static final Logger log = Logger.getLogger(CncProgramController.class.getName());
	
	@Autowired
	private CncProgramService cncProgramService;
	
	@RequestMapping({"/cncprograms"})
	public String getAllPrograms(Map<String, Object> model) {
		model.put("cncPrograms", cncProgramService.getAllPrograms());
		return "cncprograms";
	}
	
	@RequestMapping({"/cncprograms/{programuuid}"})
	@ResponseBody
	public String getProgram(Map<String, Object> model, @PathVariable String programuuid) {
//		model.put("program", cncProgramService.getProgram(UUID.fromString(programuuid)));
//		return "displayprogram";
		return cncProgramService.getProgram(UUID.fromString(programuuid)).getSourceCode().getValue();
	}
	
	@RequestMapping(value="/add", method=RequestMethod.POST)
	public String editEntry(
			@RequestParam(required=false) String programName,
			@RequestParam String sourceCode,
			Model model) {
		
		if(programName != null) programName = programName.trim();
		if(sourceCode != null) sourceCode = sourceCode.trim();
		
		log.info("programName: " + programName);
		log.info("Source Code: " + sourceCode);
		
		CncProgram program = new CncProgram(programName, new Text(sourceCode));
		UUID newGuid = cncProgramService.addProgram(program);
		model.addAttribute("guid", newGuid);
		
		log.info("New Guid: " + newGuid);
		
		return "displayguid";
	}
}
