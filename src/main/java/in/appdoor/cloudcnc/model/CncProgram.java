package in.appdoor.cloudcnc.model;

import java.util.Date;
import java.util.UUID;

import com.google.appengine.api.datastore.Text;

public class CncProgram {

	private UUID id;
	private String name;
	private Text sourceCode;
	private Date lastAccessTime;
	private Date createdTime;
	
	public CncProgram(UUID id, String name, Text sourceCode, Date createdTime) {
		this.id = id;
		this.name = name;
		this.sourceCode = sourceCode;
		this.lastAccessTime = new Date();
		this.createdTime = createdTime;
	}
	
	public CncProgram(String name, Text sourceCode) {
		this(UUID.randomUUID(), name, sourceCode, new Date());
	}

	public Date getLastAccessTime() {
		return lastAccessTime;
	}
	
	public Date getCreatedTime() {
		return createdTime;
	}

	public void setLastAccessTime(Date lastAccessTime) {
		this.lastAccessTime = lastAccessTime;
	}

	public UUID getId() {
		return id;
	}

	public Text getSourceCode() {
		return sourceCode;
	}
	
	public String getName() {
		return name;
	}
	
}
