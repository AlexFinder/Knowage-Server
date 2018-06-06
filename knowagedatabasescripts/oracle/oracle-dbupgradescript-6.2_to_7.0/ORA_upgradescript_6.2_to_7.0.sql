--- START ---
ALTER TABLE SBI_I18N_MESSAGES RENAME TO SBI_I18N_MESSAGES_OLD;

CREATE TABLE SBI_I18N_MESSAGES
AS (SELECT CAST(ROWNUM AS NUMBER(38, 0)) ID, M.*
FROM DUAL, SBI_I18N_MESSAGES_OLD M);

DROP TABLE SBI_I18N_MESSAGES_OLD;

ALTER TABLE SBI_I18N_MESSAGES ADD CONSTRAINT PK_SBI_I18N_MESSAGES PRIMARY KEY (ID);
ALTER TABLE SBI_I18N_MESSAGES ADD CONSTRAINT FK_SBI_I18N_MESSAGES FOREIGN KEY (LANGUAGE_CD) REFERENCES SBI_DOMAINS (VALUE_ID);
ALTER TABLE SBI_I18N_MESSAGES ADD CONSTRAINT SBI_I18N_MESSAGES_UNIQUE UNIQUE (LANGUAGE_CD, LABEL, ORGANIZATION);

INSERT INTO hibernate_sequences VALUES ('SBI_I18N_MESSAGES',
                                                            (SELECT NVL(MAX(m.ID) + 1, 1) FROM SBI_I18N_MESSAGES m));  
COMMIT;                                                            
--- END ---                    

CREATE UNIQUE INDEX XAK2SBI_DATA_SET ON SBI_DATA_SET(NAME, VERSION_NUM, ORGANIZATION);

ALTER TABLE SBI_ATTRIBUTE ADD (LOV_ID INTEGER NULL,ALLOW_USER SMALLINT  DEFAULT '1',MULTIVALUE SMALLINT  DEFAULT '0',SYNTAX SMALLINT NULL, 
									  VALUE_TYPE_ID INTEGER NULL, VALUE_TYPE_CD VARCHAR2(20), VALUE_TYPE VARCHAR2(50));
ALTER TABLE SBI_ATTRIBUTE ADD CONSTRAINT FK_LOV FOREIGN KEY (LOV_ID) REFERENCES SBI_LOV(LOV_ID);
ALTER TABLE SBI_ATTRIBUTE ADD CONSTRAINT ENUM_TYPE CHECK (VALUE_TYPE IN('STRING','DATE','NUM'));

ALTER TABLE SBI_ATTRIBUTE MODIFY (DESCRIPTION VARCHAR2(500) NULL);


