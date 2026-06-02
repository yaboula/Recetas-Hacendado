project_name = 'Scrum-Mercadona-CyberPandas'
project = Project.find_by(name: project_name)
if project
  puts "Deleting existing project '#{project_name}'..."
  project.destroy!
end

project = Project.create!(
  name: project_name,
  identifier: 'mercadona-cyberpandas',
  description: 'Proyecto Scrum Mercadona - CyberPandas',
  public: true
)

user_names = ['Yahini', 'Oliver', 'Safwat', 'Alexandre', 'Souhail', 'Yahya', 'Mohamed']
users_dict = {}

user_names.each do |fn|
  login = fn.downcase
  user = User.find_by(login: login)
  if user.nil?
    user = User.new(
      login: login,
      firstname: fn,
      lastname: 'TeamMember',
      mail: "#{login}@mercadona.local",
      admin: true,
      language: 'es'
    )
    user.password = 'OpenProject123!'
    user.password_confirmation = 'OpenProject123!'
    user.status = 1
    user.save!(validate: false)
    puts "Created user: #{fn}"
  end
  users_dict[fn] = user
end

role = Role.find_by(name: 'Project admin') || Role.first
users_dict.values.each do |u|
  unless Member.exists?(project: project, principal: u)
    Member.create!(project: project, principal: u, roles: [role])
  end
end

phase_type = Type.find_by(name: 'Phase') || Type.first
task_type = Type.find_by(name: 'Task') || Type.first
status = Status.default || Status.first
priority = IssuePriority.default || IssuePriority.first
author = users_dict['Yahini']

csv_data = [
  ['1. Preparación', 'T1.1', 'Configuración OpenProject y Tablero Scrum', 1, 'Yahini', []],
  ['1. Preparación', 'T1.2', 'Redacción de Casos de Uso (HU-01 a HU-05)', 2, 'Oliver', ['T1.1']],
  ['1. Preparación', 'T1.3', 'Configuración Entorno de Desarrollo y GitHub', 1, 'Safwat', ['T1.1']],
  ['2. Sprint 1', 'T2.1', 'Sprint 1 Planning (Catálogo y Recetas)', 1, 'Yahini', ['T1.2', 'T1.3']],
  ['2. Sprint 1', 'T2.2', 'Desarrollo HU-01 (Catálogo Visual)', 3, 'Souhail', ['T2.1']],
  ['2. Sprint 1', 'T2.3', 'Desarrollo HU-02 (Ficha de Receta Hacendado)', 3, 'Mohamed', ['T2.1']],
  ['2. Sprint 1', 'T2.4', 'Sprint 1 Review & Retrospective', 1, 'Yahini', ['T2.2', 'T2.3']],
  ['3. Sprint 2', 'T3.1', 'Sprint 2 Planning (Integración de Compra)', 1, 'Yahini', ['T2.4']],
  ['3. Sprint 2', 'T3.2', 'Desarrollo HU-03 (Añadir a lista 1-Click)', 3, 'Alexandre', ['T3.1']],
  ['3. Sprint 2', 'T3.3', 'Desarrollo HU-04 (Gestión Lista Digital)', 3, 'Yahya', ['T3.1']],
  ['3. Sprint 2', 'T3.4', 'Sprint 2 Review & Retrospective', 1, 'Yahini', ['T3.2', 'T3.3']],
  ['4. Sprint 3', 'T4.1', 'Sprint 3 Planning (Filtros y Pruebas)', 1, 'Yahini', ['T3.4']],
  ['4. Sprint 3', 'T4.2', 'Desarrollo HU-05 (Filtros Preferencias Alimentarias)', 2, 'Safwat', ['T4.1']],
  ['4. Sprint 3', 'T4.3', 'Pruebas de Integración y Corrección de Bugs', 1, 'Souhail', ['T4.2']],
  ['4. Sprint 3', 'T4.4', 'Documentación Final y Cierre de Repositorio', 1, 'Yahini', ['T4.3']],
  ['5. Cierre', 'T5.1', 'Preparación Presentación Final', 1, 'Yahini', ['T4.4']],
  ['5. Cierre', 'T5.2', 'Defensa Oral y Demostración Pública', 1, 'Yahini', ['T5.1']]
]

start_date_global = Date.new(2026, 4, 15)
phases = {}
wps = {}

csv_data.each do |row|
  phase_name, t_idx, t_name, t_dur, t_assignee, deps = row
  
  unless phases[phase_name]
    phases[phase_name] = WorkPackage.create!(
      project: project, type: phase_type, status: status, priority: priority,
      author: author, subject: phase_name
    )
    puts "Created phase: #{phase_name}"
  end

  max_dep_end = start_date_global - 1
  deps.each do |dep_id|
    if wps[dep_id] && wps[dep_id].due_date
      max_dep_end = wps[dep_id].due_date if wps[dep_id].due_date > max_dep_end
    end
  end

  start_date = max_dep_end + 1
  while start_date.saturday? || start_date.sunday?
    start_date += 1
  end

  due_date = start_date
  added_days = 1
  while added_days < t_dur
    due_date += 1
    added_days += 1 unless due_date.saturday? || due_date.sunday?
  end

  # Just grab the main assignee as OpenProject mainly delegates WP to a single person natively
  # Assignee matching
  assignee = users_dict[t_assignee] || users_dict['Yahini']

  wp = WorkPackage.create!(
    project: project, type: task_type, status: status, priority: priority,
    author: author, assigned_to: assignee,
    subject: "#{t_idx} - #{t_name}", parent: phases[phase_name],
    start_date: start_date, due_date: due_date,
    estimated_hours: t_dur * 8
  )
  wps[t_idx] = wp

  deps.each do |dep_id|
    if wps[dep_id]
      Relation.create!(
        from: wps[dep_id], to: wp, relation_type: Relation::TYPE_PRECEDES
      )
    end
  end
  puts "Created task: #{t_idx} - #{t_name} (Start: #{start_date}, End: #{due_date})"
end
puts "Setup for '#{project_name}' completed successfully!"
