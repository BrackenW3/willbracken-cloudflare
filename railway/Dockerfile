FROM neo4j:5.18.0-enterprise

# Accept the Enterprise Evaluation License (required for GDS)
ENV NEO4J_ACCEPT_LICENSE_AGREEMENT=yes

# Automatically download and install Graph Data Science and APOC plugins on startup
ENV NEO4J_PLUGINS='["graph-data-science", "apoc"]'

# Memory configuration optimized for Railway's standard tiers (adjust based on your plan)
ENV NEO4J_dbms_memory_heap_initial__size=1G
ENV NEO4J_dbms_memory_heap_max__size=2G
ENV NEO4J_dbms_memory_pagecache_size=1G

# Security whitelists to allow advanced algorithms to run
ENV NEO4J_dbms_security_procedures_unrestricted=gds.*,apoc.*
ENV NEO4J_dbms_security_procedures_allowlist=gds.*,apoc.*

# Railway exposes the HTTP port via the PORT environment variable.
# We configure Neo4j to listen on 0.0.0.0 and map standard ports.
EXPOSE 7474 7687

# The NEO4J_AUTH environment variable must be set in your Railway project settings:
# Example: NEO4J_AUTH=neo4j/SecurePassword123!
