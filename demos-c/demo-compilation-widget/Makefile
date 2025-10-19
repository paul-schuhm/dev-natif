LIB_NAME=widget
TARGET_LIB=lib$(LIB_NAME).so
TARGET_APP=myapp
DIR_TO_INSTALL_LIBS=/usr/local/lib


#Compiler la lib de widget sous forme de shared lib (.so)
$(TARGET_LIB): widget.c
	gcc -c $(LIB_NAME).c -o $(LIB_NAME).o
	gcc -shared $(LIB_NAME).o -o lib$(LIB_NAME).so
	@#On installe la librairie sur le système (path des libs)
	sudo cp lib$(LIB_NAME).so $(DIR_TO_INSTALL_LIBS)
	@echo "La librarie $(LIB_NAME) a été compilée et installée avec succès!"
	


# Penser à recharger le cache du loader (pour trouver les .so) avec `sudo ldconfig`. /usr/local/lib (la où on a installé la lib) est scanné et libwidget.so est ajouté au cache

$(TARGET_APP): main.c $(TARGET_LIB)
	gcc -c main.c -o $(TARGET_APP).o
	@#On fait le link avec la librairie installée
	gcc -L$(PWD) $(TARGET_APP).o -l$(LIB_NAME) -o $(TARGET_APP)
	@echo "Le projet $(TARGET_APP) a été compilé avec succès !"

clean:
	rm -f *.o *.so $(TARGET_APP)
