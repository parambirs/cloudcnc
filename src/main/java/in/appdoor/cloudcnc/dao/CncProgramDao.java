package in.appdoor.cloudcnc.dao;

import java.util.Collection;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import in.appdoor.cloudcnc.model.CncProgram;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Text;

@Component
public class CncProgramDao {

	@Autowired
	protected DatastoreService datastoreService;

	public UUID addProgram(CncProgram program) {
		Entity entity = objectToEntity(program); 
		datastoreService.put(entity);
		return program.getId();
	}
	
	public CncProgram getProgram(UUID program) {
		try {
			Entity e = datastoreService.get(KeyFactory.createKey("Program", program.toString()));
			return entityToObject(e);
		} catch (EntityNotFoundException e) {
			return null;
		}
	}
	
	public Collection<CncProgram> getAllPrograms() {
		Query query = new Query("Program").addSort("lastAccessTime", Query.SortDirection.DESCENDING);;
		
		List<CncProgram> result = new LinkedList<CncProgram>();
		PreparedQuery q = datastoreService.prepare(query);
		
		for(Entity e : q.asIterable()) {
			CncProgram entry = entityToObject(e);
			result.add(entry);
		}
		
		return result;
	}
	
	private Entity objectToEntity(CncProgram program) {
		Entity entity = new Entity("Program", program.getId().toString());
		entity.setProperty("id", program.getId().toString());
		entity.setProperty("name", program.getName());
		entity.setProperty("sourceCode", program.getSourceCode());
		entity.setProperty("lastAccessTime", program.getLastAccessTime());
		entity.setProperty("createdTime", program.getCreatedTime());
		return entity;
	}
	
	private CncProgram entityToObject(Entity e) {
		CncProgram program = new CncProgram(
				UUID.fromString((String)e.getProperty("id")),
				(String)e.getProperty("name"),
				(Text)e.getProperty("sourceCode"),
				(Date)e.getProperty("createdTime"));
		
		// save to update lastAccessTime
		addProgram(program);
		
		return program;
	}
}
