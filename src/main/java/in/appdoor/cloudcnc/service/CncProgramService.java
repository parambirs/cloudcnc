package in.appdoor.cloudcnc.service;

import in.appdoor.cloudcnc.dao.CncProgramDao;
import in.appdoor.cloudcnc.model.CncProgram;

import java.util.Collection;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CncProgramService {

	@Autowired
	private CncProgramDao programDao;
	
	public UUID addProgram(CncProgram user) {
		return programDao.addProgram(user);
	}
	
	public CncProgram getProgram(UUID uuid) {
		return programDao.getProgram(uuid);
	}
	
	public Collection<CncProgram> getAllPrograms() {
		return programDao.getAllPrograms();
	}
}
