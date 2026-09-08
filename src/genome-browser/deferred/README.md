# Deferred alpha tracks

Manhattan, LD, single-cell GRN, and single-cell QTL modules are retained here for a later beta port. They are not registered or imported by the application, and this directory is excluded from TypeScript checking until that port. The corresponding single-cell interaction collection and default IDs are retained but not offered in the active track selector.

Port the reader imports, fetch/render contracts, settings, and interaction callbacks to the beta APIs before registering these modules again, removing the TypeScript exclusion, and restoring GRN/QTL browser panels. See genomebrowser's core customTrackModules and tracks documentation.
