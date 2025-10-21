APP_NAME := myapp
VERSION := $(shell cat VERSION)
BUILD_DIR := build
PREFIX := /usr/local

all: $(BUILD_DIR)/$(APP_NAME)

# Si la version change, on rebuild
# La version est injectée au moment du build sous forme de macro (option -D)
$(BUILD_DIR)/$(APP_NAME): src/main.c VERSION
	mkdir -p $(BUILD_DIR)
	gcc -DAPP_VERSION=\"$(VERSION)\" -o $(BUILD_DIR)/$(APP_NAME) src/main.c -lcurl

clean:
	rm -rf $(BUILD_DIR) *.deb

# Construction du paquet .deb
deb: all
	rm -rf $(APP_NAME)_$(VERSION)
	mkdir -p $(APP_NAME)_$(VERSION)/DEBIAN
	mkdir -p $(APP_NAME)_$(VERSION)$(PREFIX)/bin

	cp $(BUILD_DIR)/$(APP_NAME) $(APP_NAME)_$(VERSION)$(PREFIX)/bin/

	# Génère le fichier control en remplaçant @VERSION@ par celui présent dans notre fichier VERSION
	sed "s/@VERSION@/$(VERSION)/" debian/control > $(APP_NAME)_$(VERSION)/DEBIAN/control

	# Copie les éventuels scripts postinst (post-installation)
	if [ -f debian/postinst ]; then \
		cp debian/postinst $(APP_NAME)_$(VERSION)/DEBIAN/postinst; \
		chmod 755 $(APP_NAME)_$(VERSION)/DEBIAN/postinst; \
	fi

	# etc...

	dpkg-deb --build $(APP_NAME)_$(VERSION)